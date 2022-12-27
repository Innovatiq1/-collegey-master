import { Component, OnInit,Input } from '@angular/core';
import { jsPDF } from 'jspdf';
import domtoimage from 'dom-to-image';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.css']
})
export class CertificateComponent implements OnInit {
  @Input() activeTab:any;

  title = 'html-to-pdf';
  constructor() { }

  ngOnInit(): void {
  }

  toPdf() {
    const dashboard = document.getElementById('contentToConvert');
    
    const dashboardHeight = dashboard.clientHeight;
    const dashboardWidth = dashboard.clientWidth;
    const options = { background: 'white', width: dashboardWidth, height: dashboardHeight };
  
    domtoimage.toPng(dashboard, options).then((imgData) => {
         const doc = new jsPDF(dashboardWidth > dashboardHeight ? 'l' : 'p', 'mm', [dashboardWidth, dashboardHeight]);
         const imgProps = doc.getImageProperties(imgData);
         const pdfWidth = doc.internal.pageSize.getWidth();
         const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
         doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
         doc.save('Dashboard for hyperpanels.pdf');
    });
  }

}

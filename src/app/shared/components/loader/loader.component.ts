import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {
  @Input() bdColor = 'rgba(0, 0, 0, 0.8)'
  @Input() size = 'default' || 'small' || 'medium' || 'large';
  @Input() color = '#091955';
  @Input() type = 'square-spin';
  @Input() fullScreen = true;

  constructor() {
  }
  ngOnInit() {
  }
}

import { Component, OnInit } from '@angular/core';
import { StudentService } from 'src/app/core/services/student.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  resp = [];
  categories = new Map();
  faqData:any; 
  constructor(private studentService: StudentService) { }

  ngOnInit(): void {
    this.getFaqDescription();
  }

  getFaqDescription() {
    this.studentService.getFaqData().subscribe(data => {
      this.resp    = data;
      this.faqData = data;
      this.resp.map(cat => {
        if(this.categories.has(cat.category)){
         let questions= this.categories.get(cat.category);
          questions.push({"question":cat.ques, "answer": cat.answer})
          this.categories.set(cat.category,questions);
        }else{
          this.categories.set(cat.category,[{"question":cat.ques, "answer": cat.answer}])
        }
       }) 
    })
  }

  getQuestion(categoryName: string) {
    return this.categories.get(categoryName);
  }

}

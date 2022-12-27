import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    var modal = document.getElementById("myModal");
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
  }
  myFunction(){
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
  }

  onOpean(){
    // Get the modal
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
  }

  onclose(){
    var modal = document.getElementById("myModal");
      // Get the button that opens the modal
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    modal.style.display = "none";
    // When the user clicks the button, open the modal 
  }

}

import { Component, OnInit } from '@angular/core';
import { Country, State, City } from 'country-state-city';

@Component({
  selector: 'app-impact-profile',
  templateUrl: './impact-profile.component.html',
  styleUrls: ['./impact-profile.component.css']
})
export class ImpactProfileComponent implements OnInit {
  impactprofile = true;
  impactproject = false;
  isCharheStudent: number = -1;
  countries = [];
  states = [];
  cities = [];
  selectedCountry: any;
  selectedState: any;
  selectedCity: any;
  constructor() { }

  ngOnInit(): void {
    this.countries = Country.getAllCountries();
  }
  ipprofile() {
    console.log("hii inoij")
    this.impactprofile = true;
    this.impactproject = false;

  }
  projectonboarding() {
    console.log("gugu")
    this.impactprofile = false;
    this.impactproject = true;
  }

  clickRadio(event) {
    console.log(event.target.value, "kkkkkkkkkkk");
    if (event.target.value == 1) {
      this.isCharheStudent = 1;
    } else if (event.target.value == 0) {
      this.isCharheStudent = 0;
    } else {
      this.isCharheStudent = -1
    }
  }

  onSelectCountry(event) {
    this.states = State.getStatesOfCountry(event.target.value)
  }

  onSelectState(event) {
    let a = event.target.value
    let countryCode = a.slice(0, 2)
    let isoCode = a.slice(2, a.length)
    this.cities = City.getCitiesOfState(countryCode, isoCode)
  }
}

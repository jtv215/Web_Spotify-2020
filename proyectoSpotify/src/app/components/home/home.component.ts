import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public titulo: string;
  public identity;
  public token;
  public url: string;

  constructor(
  ) {  }

  ngOnInit() {
  }

}

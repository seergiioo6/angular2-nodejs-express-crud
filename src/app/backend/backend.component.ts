import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder }  from '@angular/forms';

import { ToastComponent } from '../shared/toast/toast.component';
import { DataService } from '../services/data.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './backend.component.html',
  styleUrls: ['./backend.component.css']
})
export class BackendComponent implements OnInit {

  websites = [];
  count: number;;
  isLoading = true;
  busqueda: any = '';
  website = {};
  isEditing = false;
  roles: any;
  model: any = {};
  currentUser: any;
  offset: number = 0;
  isAdmin: boolean;

  addWebsiteForm: FormGroup;
  name = new FormControl('', Validators.required);
  format = new FormControl('', Validators.required);
  impressions = new FormControl('', Validators.required);
  earning = new FormControl('', Validators.required);
  // clicks = new FormControl('', Validators.required);
  // ctr = new FormControl('', Validators.required);
  ecpm = new FormControl('', Validators.required);

  constructor(private http: Http,
              private dataService: DataService,
              public toast: ToastComponent,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.roles = this.route.data
    this.getWebsites('', 8, 0);
    this.setWebsitesCount();
    this.addWebsiteForm = this.formBuilder.group({
      name: this.name,
      format: this.format,
      impressions: this.impressions,
      earning: this.earning,
      ecpm: this.ecpm,
      date: Date.now()
    });
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))

    if(!this.currentUser.admin){
      this.isAdmin = false;
    }
    else{
      this.isAdmin = true;
    }
    
  }

  busca() {
    this.getWebsites(this.busqueda, 8, 0)
    this.offset = 0;
  }

  setWebsitesCount() {
    this.dataService.getWebsitesCount().subscribe(
      data => this.count = data,
      error => console.log(error)
    );
  }

  getWebsites(keywords, limit, offset) {
    this.dataService.getWebsites(keywords,limit, offset).subscribe(
      data => this.websites = data,
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  addWebsite() {
    this.dataService.addWebsite(this.addWebsiteForm.value).subscribe(
      res => {
        this.getWebsites('', 8, 0)
        this.addWebsiteForm.reset();
        this.toast.setMessage('Website added successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  enableEditing(website) {
    this.isEditing = true;
    this.website = website;
  }

  cancelEditing() {
    this.isEditing = false;
    this.website = {};
    this.toast.setMessage('Website editing cancelled.', 'warning');
    this.getWebsites('', 8, 0);
  }

  editWebsite(website) {
    this.dataService.editWebsite(website).subscribe(
      res => {
        this.isEditing = false;
        this.website = website;
        this.toast.setMessage('Website edited successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  deleteWebsite(website) {
    if (window.confirm('Are you sure you want to permanently delete this website?')) {
      this.dataService.deleteWebsite(website).subscribe(
        res => {
          let pos = this.websites.map(elem => { return elem._id; }).indexOf(website._id);
          this.websites.splice(pos, 1);
          this.toast.setMessage('Website deleted successfully.', 'success');
        },
        error => console.log(error)
      );
    }
  }

  previous() {
    this.offset = this.offset-8 >= 0 ? this.offset-8 : this.offset;
    this.getWebsites(this.busqueda, 8, this.offset)
  }

  next() {
    this.offset = this.offset+8 <= this.count ? this.offset+8 : this.offset;
    this.getWebsites(this.busqueda, 8, this.offset)
  }

}

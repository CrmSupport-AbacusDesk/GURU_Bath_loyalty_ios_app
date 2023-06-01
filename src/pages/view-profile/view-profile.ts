import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';

@IonicPage()
@Component({
  selector: 'page-view-profile',
  templateUrl: 'view-profile.html',
})
export class ViewProfilePage {
  profile_pic:any='';
  invoice_pic:any='';
  url:any=''


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl:ViewController,
              public service:DbserviceProvider) {

                this.url = service.upload_url3;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewProfilePage');
    this.profile_pic=this.navParams.get("Image");
    console.log(this.profile_pic);
    
     this.invoice_pic=this.navParams.get("type");
     console.log(this.invoice_pic);
     
  }
  closeModal(){
    this.viewCtrl.dismiss();
  }


}

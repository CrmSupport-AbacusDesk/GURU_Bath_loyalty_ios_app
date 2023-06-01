import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform,Nav } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-aboutus-modal',
  templateUrl: 'aboutus-modal.html',
})
export class AboutusModalPage {
  @ViewChild(Nav) nav: Nav;
  user_type:string = '';
  name:string = '';
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public platform: Platform,
              public db:DbserviceProvider) {
                this.user_type = db.userStorageData.type
                this.name = db.userStorageData
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutusModalPage');
  }

  dismiss() {
   let data = { 'foo': 'bar' };
   this.viewCtrl.dismiss(data);
 }
 exitapp()
 {
   console.log('exit');
  this.platform.exitApp();
 }
 gotoHomePage()
 {
     console.log('gotohome');
     this.navCtrl.setRoot(TabsPage,{index:'0'});
 }
}

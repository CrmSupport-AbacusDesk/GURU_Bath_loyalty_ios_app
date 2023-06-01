import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';

/**
 * Generated class for the Super30Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-super30',
  templateUrl: 'super30.html',
})
export class Super30Page {

  plumber_list:any=[];
  dealer_list:any=[];
  loading:Loading;
  filter:any={}
  SelfData:any={}
  test:any=[];
  userType:any ='';
  url:string='';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public dbService:DbserviceProvider,
              public loadingCtrl:LoadingController) {
                this.url = dbService.upload_url3  

                this.userType = dbService.userStorageData.type;
                this.presentLoading();
    this.getList();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Super30Page');
    
    this.getList();

  }

  presentLoading()
  {
    this.loading = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  doRefresh(refresher)
  {
    console.log('Begin async operation', refresher);
    this.getList();
    refresher.complete();
  }
 
  getList()
  {
    this.filter.limit = 0;

  
    this.loading.dismiss(); 
    this.dbService.onPostRequestDataFromApi( {'filter':this.filter},'app_karigar/getSuperPlumberList', this.dbService.rootUrl).subscribe(response =>
      {
        console.log(response);
        // this.loading.dismiss();
        this.plumber_list = response['karigars'];
        this.dealer_list = response['dealer'];
        console.log(this.plumber_list);

      });
  }

  flag:any='';


  loadData(infiniteScroll)
  {
    console.log('loading');

    this.filter.limit=this.plumber_list.length;
    this.filter.limit=this.dealer_list.length;
    this.dbService.onPostRequestDataFromApi({'filter' : this.filter},'app_karigar/getSuperPlumberList', this.dbService.rootUrl).subscribe( r =>
      {
        console.log(r);
        if(r['karigars']=='')
        {
          this.flag=1;
        }
        else
        {
          setTimeout(()=>{
            this.plumber_list=this.plumber_list.concat(r['karigars']);
            console.log('Asyn operation has stop')
            infiniteScroll.complete();
          },1000);
        }
      });
    }

}

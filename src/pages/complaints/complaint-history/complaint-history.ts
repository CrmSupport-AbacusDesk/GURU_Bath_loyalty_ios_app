import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Loading, LoadingController } from 'ionic-angular';
import { ComplaintDetailPage} from '../../complaints/complaint-detail/complaint-detail';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';


/**
* Generated class for the ComplaintHistoryPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-complaint-history',
  templateUrl: 'complaint-history.html',
})
export class ComplaintHistoryPage {
  complaint_list : any=[];
  loading:Loading;
  filter:any={};
  flag:any='';
  complaint_count:any='';
  data:any={};
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public dbService:DbserviceProvider,
              public alertCtrl:AlertController,
              public loadingCtrl:LoadingController)
  {
    console.log(this.navParams);
    this.data.type  = this.navParams.data.type;
    console.log(this.data.type);
    this.presentLoading();
    this.getComplaintHistory(this.data.type)

  }

  ionViewDidLoad() {
    this.filter.status='';
    console.log('ionViewDidLoad ComplaintHistoryPage');
  }

  onComplaintdetail(id)
  {
    this.navCtrl.push(ComplaintDetailPage,{'id':id});
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
    this.getComplaintHistory(this.data.type);
    refresher.complete();
  }

  getComplaintHistory(type)
  {
    console.log(type)
    this.flag=0;
    this.filter.limit = 0;
    this.dbService.onPostRequestDataFromApi( {'filter':this.filter,type:{type:type}, 'retailer_id':this.dbService.userStorageData.id}, 'app_karigar/getComplaintList', this.dbService.rootUrl).subscribe(response =>
      {
        console.log(response);
        this.loading.dismiss();
        this.complaint_list = response['complaintList'];
        this.complaint_count = response['complaint_count'];
        console.log(this.complaint_list);

        // this.showSuccess("Profile Photo Updated")
      });
    }

    loadData(infiniteScroll, type)
    {
      console.log('loading');
      console.log('====================================');
      console.log(infiniteScroll);
      console.log(type);
      console.log('====================================');


      this.filter.limit=this.complaint_list.length;
      // 'customer_id':this.dbService.userStorageData.id ,
      this.dbService.onPostRequestDataFromApi({'filter' : this.filter,type:{type:type}},'app_karigar/getComplaintList', this.dbService.rootUrl).subscribe( r =>
        {
          console.log(r);
          console.log('====================================');
          console.log(type);
          console.log('====================================');
          if(r['complaintList']=='')
          {
            this.flag=1;
          }
          else
          {
            setTimeout(()=>{
              this.complaint_list=this.complaint_list.concat(r['complaintList']);
              console.log('Asyn operation has stop');
              console.log("scrolling List =====>");
              console.log(this.complaint_list);
              console.log("scrolling List =====>");
              infiniteScroll.complete();
            },1000);
          }
        });
      }

      showSuccess(text)
      {
        let alert = this.alertCtrl.create({
          title:'Success!',
          subTitle: text,
          buttons: ['OK']
        });
        alert.present();
      }

    }



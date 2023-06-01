import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Loading, LoadingController } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';

@IonicPage()
@Component({
    selector: 'page-notification',
    templateUrl: 'notification.html',
})
export class NotificationPage {
    
    
    loading:Loading;
    data:any =[];
    
    constructor(public navCtrl: NavController, public navParams: NavParams,private app:App, public loadingCtrl:LoadingController, public dbService:DbserviceProvider,) {
        this.presentLoading();
        this.getNotification();
    }
    
    ionViewDidLoad() {
        
    }
    
    // ionViewDidLeave()
    // {
    //     let nav = this.app.getActiveNav();
    //     if(nav && nav.getActive())
    //     {
    //         let activeView = nav.getActive().name;
    //         let previuosView = '';
    //         if(nav.getPrevious() && nav.getPrevious().name)
    //         {
    //             previuosView = nav.getPrevious().name;
    //         }
    //         console.log(previuosView);
    //         console.log(activeView);
    //         console.log('its leaving');
    //         if((activeView == 'HomePage' || activeView == 'GiftListPage' || activeView == 'TransactionPage' || activeView == 'ProfilePage' ||activeView =='MainHomePage') && (previuosView != 'HomePage' && previuosView != 'GiftListPage'  && previuosView != 'TransactionPage' && previuosView != 'ProfilePage' && previuosView != 'MainHomePage'))
    //         {
    
    //             console.log(previuosView);
    //             this.navCtrl.popToRoot();
    //         }
    //     }
    //  }
    
    presentLoading()
    {
        this.loading = this.loadingCtrl.create({
            content: "Please wait...",
            dismissOnPageChange: true
        });
        this.loading.present();
    }
    
    
    doRefresh (refresher)
    {
        this.getNotification();
        
        setTimeout(() => {
            refresher.complete();
        }, 1000);
    }
    
    getNotification()
    {
        //  this.presentLoading();
        this.loading.present
        this.dbService.onPostRequestDataFromApi({'karigar_id':this.dbService.userStorageData.id, "limit":0},'app_karigar/get_notification', this.dbService.rootUrl).subscribe((r:any)=>
        {
            console.log(r);
            this.data = r.notification;
            console.log(this.data);
            
            this.loading.dismiss();
        },() => {
            this.loading.dismiss();
        });
    }
    
    
    
    
    
    flag:any='';
    loadData(infiniteScroll)
    {
        this.dbService.post_rqst({"karigar_id":this.dbService.userStorageData.id,"limit":this.data.length},'app_karigar/get_notification')
        .subscribe( (resp) =>
        {
            console.log(resp);
            if(resp=='')
            {
                this.flag=1;
            }
            else
            {
                setTimeout(()=>{
                    this.data=this.data.concat(resp['notification']);
                    console.log('Asyn operation has stop')
                    infiniteScroll.complete();
                },1000);
            }
        });
    }
}

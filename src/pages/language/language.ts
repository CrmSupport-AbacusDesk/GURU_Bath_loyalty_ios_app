import { Component } from '@angular/core';
import { AlertController, IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import JwtDecode from 'jwt-decode';
import { SelectRegistrationTypePage } from '../select-registration-type/select-registration-type';
import { MobileLoginPage } from '../login-section/mobile-login/mobile-login';

/**
 * Generated class for the LanguagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-language',
  templateUrl: 'language.html',
})





export class LanguagePage {
    
  loading:Loading;
  come_from:any="";
  karigar_id:any="";
  constructor(public navCtrl: NavController, public navParams: NavParams,public db:DbserviceProvider,public storage : Storage,public translate:TranslateService,public loadingCtrl:LoadingController,public alertCtrl:AlertController) {
  }
  lang:any='en';
  ionViewDidLoad() {
      // commented
      // this.presentLoading();
      this.change_language();
      
      this.storage.get('token')
      .then(resp=>{
          console.log(JwtDecode(resp));
          let tokendata = JwtDecode(resp);
          console.log(tokendata);
          // this.karigar_id = tokendata.sub;
          this.karigar_id = tokendata;

          this.get_user_lang();
      })
      
      this.come_from = this.navParams.get("come_from");
      this.translate.setDefaultLang(this.lang);
      this.translate.use(this.lang);
      console.log('ionViewDidLoad LanguagePage');
  }
  senDiviceVersion
  presentLoading() 
  {
      this.translate.get("Please wait...")
      .subscribe(resp=>{
          this.loading = this.loadingCtrl.create({
              content: resp,
              dismissOnPageChange: false
          });
          this.loading.present();
      })
  }
  
  inputs:any=[];
  tokenInfo:any={};
  change_language()
  {
      this.inputs = [];
      this.db.get_rqst("app_karigar/get_languages")
      .subscribe(resp=>{
          console.log(resp);
          this.inputs = resp
          this.loading.dismiss();
          console.log(this.inputs);
      })
  }
  
  continue()
  {
      this.navCtrl.push(MobileLoginPage, { registerType : 'Plumber', lang:this.lang});
    //   this.navCtrl.push(SelectRegistrationTypePage,{"lang":this.lang});
  }
  
  set_lang()
  {
      this.translate.use(this.lang);
  }
  
  getDecodedAccessToken(token: string): any {
      try{
          return JwtDecode(token);
      }
      catch(Error){
          return null;
      }
  }
  
  karigar_detail:any={};
  chs_lng:any=""
  no:any=""
  yes:any=""
  sure:any=""
  update_lang()
  {
      this.translate.get("Change Language")
      .subscribe(resp=>{
          this.chs_lng = resp;
      })
      
      this.translate.get("No")
      .subscribe(resp=>{
          this.no = resp;
      })
      this.translate.get("Yes")
      .subscribe(resp=>{
          this.yes = resp;
      })
      this.translate.get("Do you want to change the language?")
      .subscribe(resp=>{
          this.chs_lng = resp;
      })
      let updateAlert = this.alertCtrl.create({
          title: this.chs_lng,
          message: this.sure,
          buttons: [
              {
                  text: this.no, 
              },
              {
                  text: this.yes,
                  handler: () => {
                      this.karigar_detail.language = this.lang;
                      this.karigar_detail.id = this.karigar_id;
                      this.db.post_rqst({"data":this.karigar_detail},"app_karigar/update_language")
                      .subscribe(resp=>{
                          console.log(resp);
                          this.navCtrl.push(SelectRegistrationTypePage,{"lang":this.lang});
                          // this.navCtrl.push(HomePage);
                      })
                  } 
              }
          ]
      });
      updateAlert.present();
  }

  get_user_lang()
  {
      this.storage.get("token")
      .then(resp=>{
          this.tokenInfo = this.getDecodedAccessToken(resp );
          
          this.db.post_rqst({"login_id":this.karigar_id},"app_karigar/get_user_lang")
          .subscribe(resp=>{
              console.log(resp);
              this.lang = resp['language'];
              if(this.lang == "")
              {
                  this.lang = "en";
              }
              this.translate.use(this.lang);
          })
      })
  }
}

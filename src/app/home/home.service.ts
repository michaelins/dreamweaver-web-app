import { Injectable } from '@angular/core';
import { Product } from '../shared/model/product.model';
import { ModalController } from '@ionic/angular';
import { LoginComponent } from '../shared/login/login.component';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private modalCtrl: ModalController) { }

  private _products: Product[] = [
    new Product(
      'p1',
      '布拉斯凯特群岛',
      '布拉斯凯特群岛位于丁格尔半岛西侧，是爱尔兰最偏西的领土，由多座岛屿组成（其中6座面积较大），它的名称可能来自北欧单词brasker，意为“危险的地方”。这个地区只讲爱尔兰语，在1953年之前岛上有人居住，许多作家和语言学家在这里定居写作、研究语言并融入传统的生活方式。后来，群岛上的居民移居到了丁格尔半岛和美国马萨诸塞州的斯普林菲尔德(Springfield, Massachusetts)，这里一度废弃为荒岛。',
      '/assets/images/Blasket Islands, Ireland 1920x1080.jpg',
      189.99
    ),
    new Product(
      'p2',
      '布莱德河峡谷',
      '布菜德河峡谷是姆普马兰加省仅次于姆普马兰加国家公园的观光景点，位于南非克鲁格国家公园西边的布莱德河峡谷自然保护区。',
      '/assets/images/Blyde River Canyon 1920x1080.jpg',
      229.99
    ),
    new Product(
      'p3',
      '楠府',
      '楠府(难府)长久以来因为地理位置偏远，与其他王国少有往来，故始终保持独立。13世纪末期，第一个王朝建立于Mueang Pua（又名Varanagara）附近。统治者是Phukha王朝，与永珍建国者有亲戚关系。然而因为往南发展比往东或往西容易一点，所以他开始和素可泰王朝来往。在十四世纪他迁都到今天的楠府城。',
      '/assets/images/Nan Province, Thailand 1920x1080.jpg',
      89.99
    ),
    new Product(
      'p4',
      '纽玛瀑布',
      '跟随朱砂河(VermilionRiver)的主河顺流而下就能看到这个壮观的瀑布。 ',
      '/assets/images/Numa Falls, Canada 1920x1080.jpg',
      269.99
    ),
    new Product(
      'p5',
      '西斯特龙',
      '斯特龙博利岛Stromboli Island意大利语作Isola Stromboli，拉丁语作Strongyle。位于地中海的第勒尼安(Tyrrhenian)海。隶属意大利西西里区。位于西西里岛近海的利帕里群岛东北端。面积13平方公里。人口35.5万(1971)。为火成岛。岛上火山仍在活动，熔岩不断从火山口流到海里。',
      '/assets/images/Sisteron, France 1920x1080.jpg',
      389.99
    )
  ];

  get products() {
    return [...this._products];
  }

  getProduct(ProductId: string) {
    return { ...this._products.find(p => p.id === ProductId) };
  }

  getWrongInfo() {
    this.modalCtrl.create({
      component: LoginComponent
    }).then(modal => {
      modal.present();
    });
  }
}

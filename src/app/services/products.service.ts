import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Product {
  component: string;
  id: string;
  category: string;
  theme: string[];
  prioritary: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly products: Product[] = [
      { component: '1746262304851', id: '9698056798555', category: 'hommes', theme: ['angular'], prioritary: true },
      { component: '1746258121419', id: '9879512351067', category: 'hommes', theme: ['angular'], prioritary: false },
      { component: '1746294248466', id: '9879805395291', category: 'hommes', theme: ['angular'], prioritary: true },
      { component: '1746294331847', id: '9879808672091', category: 'hommes', theme: ['angular'], prioritary: true },
      { component: '1746404732790', id: '9881257574747', category: 'hommes', theme: ['angular'], prioritary: true },
      { component: '1746428728561', id: '9881395429723', category: 'maison', theme: ['angular'], prioritary: true },
      { component: '1746430266071', id: '9881414271323', category: 'maison', theme: ['angular'], prioritary: false },
      { component: '1746430349878', id: '9881411813723', category: 'maison', theme: ['angular'], prioritary: true },
      { component: '1746610575301', id: '9887484674395', category: 'maison', theme: ['hello kitty'], prioritary: false },
      { component: '1746611752322', id: '9887524094299', category: 'femmes', theme: ['hello kitty'], prioritary: true },

      { component: '1746732417993', id: '9891635495259', category: 'femmes', theme: ['rs'], prioritary: true },
      { component: '1746633268270', id: '9888303579483', category: 'femmes', theme: ['rs'], prioritary: true },
      { component: '1746634547276', id: '9888352928091', category: 'hommes', theme: ['angular', 'pokemon'], prioritary: true },
      { component: '1746635517652', id: '9888386646363', category: 'hommes', theme: ['c++', 'pokemon'], prioritary: true },
      { component: '1746635660529', id: '9888396902747', category: 'hommes', theme: ['docker', 'pokemon'], prioritary: false },
      { component: '1746636120006', id: '9888421118299', category: 'hommes', theme: ['java', 'pokemon'], prioritary: true },
      { component: '1746636647498', id: '9888436650331', category: 'hommes', theme: ['react', 'pokemon'], prioritary: false },
      { component: '1746637225107', id: '9888452084059', category: 'hommes', theme: ['react', 'DBZ'], prioritary: true },
      { component: '1746638162277', id: '9888477086043', category: 'hommes', theme: ['angular', 'DBZ'], prioritary: true },

      { component: '1746639225893', id: '9888504545627', category: 'hommes', theme: ['rs'], prioritary: false },
      { component: '1746640097726', id: '9888527090011', category: 'hommes', theme: ['rs'], prioritary: true },
      { component: '1746736407663', id: '9891805528411', category: 'hommes', theme: ['rs'], prioritary: true },
      { component: '1746736872758', id: '9891827188059', category: 'hommes', theme: ['rs'], prioritary: true },
      { component: '1746737527729', id: '9891855565147', category: 'hommes', theme: ['rs'], prioritary: true },
      { component: '1746738378281', id: '9891901276507', category: 'hommes', theme: ['rs'], prioritary: true },
      { component: '1747328163472', id: '9900459426139', category: 'hommes', theme: ['rs'], prioritary: true },
      { component: '1747339188142', id: '9900517884251', category: 'hommes', theme: ['rs'], prioritary: true },
      { component: '1747339375388', id: '9900525420891', category: 'femmes', theme: ['rs'], prioritary: true },
      { component: '1747341061013', id: '9900662587739', category: 'femmes', theme: ['rs'], prioritary: false },
      { component: '1747342008257', id: '9900671828315', category: 'femmes', theme: ['rs'], prioritary: false },
      { component: '1747343258833', id: '9900683002203', category: 'hommes', theme: ['rs'], prioritary: false },
      { component: '1747344026376', id: '9900693225819', category: 'hommes', theme: ['rs'], prioritary: false },
      { component: '1747344345473', id: '9900695847259', category: 'hommes', theme: ['rs'], prioritary: true },
      { component: '1747344830170', id: '9900701843803', category: 'hommes', theme: ['rs'], prioritary: true },
      { component: '1747345308316', id: '9900705743195', category: 'hommes', theme: ['rs'], prioritary: false },
      { component: '1747345922328', id: '9900711379291', category: 'hommes', theme: ['rs'], prioritary: true },
      { component: '1747495353961', id: '9903723250011', category: 'hommes', theme: ['rs'], prioritary: true },
      { component: '1747496440258', id: '9903731540315', category: 'hommes', theme: ['rs'], prioritary: true },
      { component: '1747497459133', id: '9903743369563', category: 'hommes', theme: ['rs'], prioritary: true },
      { component: '1747497993907', id: '9903746515291', category: 'hommes', theme: ['rs'], prioritary: true },
      { component: '1748109198345', id: '9905642209627', category: 'hommes', theme: ['rs'], prioritary: true },
      { component: '1748109259742', id: '9917987979611', category: 'hommes', theme: ['rs'], prioritary: true },
      { component: '1748109335109', id: '9909646885211', category: 'femmes', theme: ['rs'], prioritary: true },
      { component: '1748462162689', id: '9924947280219', category: 'hommes', theme: ['rs'], prioritary: true },
      { component: '1748462908324', id: '9924964680027', category: 'hommes', theme: ['rs'], prioritary: true },
      { component: '1748593579957', id: '9922103050587', category: 'jouets', theme: ['retro'], prioritary: true },
  ];

  getProducts(): Observable<Product[]> {
    return of(this.products);
  }
}


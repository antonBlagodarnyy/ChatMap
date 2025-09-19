import { Component} from '@angular/core';
import { HeaderComponent } from '../../Components/map/header/header.component';

@Component({
  selector: 'app-map',
  imports: [
    HeaderComponent,
  ],
  templateUrl: './map.component.html',
})
export class MapComponent {
 
  constructor(
  ) {}

 
}

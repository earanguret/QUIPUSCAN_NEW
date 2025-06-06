import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavegatorComponent } from '../../../shared/components/navegator/navegator.component';
import { SubnavegatorComponent } from '../../../shared/components/subnavegator/subnavegator.component';

@Component({
  selector: 'app-mod-usuario',
  imports: [NavegatorComponent, SubnavegatorComponent, CommonModule],
  templateUrl: './mod-usuario.component.html',
  styleUrl: './mod-usuario.component.css'
})
export class ModUsuarioComponent {

  constructor(private router:Router) { }

}

import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { LoginService } from '../../services/remoto/login/login.service';


@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  credentials: any = {
    username: '',
    password: ''
  };

  imagePaths: string[] = [
    'img/portada_login/portada_login1.jpg',
    'img/portada_login/portada_login2.jpg',
    'img/portada_login/portada_login3.jpg',
    'img/portada_login/portada_login4.jpg',
    'img/portada_login/portada_login5.jpg',
    'img/portada_login/portada_login6.jpg',
    'img/portada_login/portada_login7.jpg',
    'img/portada_login/portada_login8.jpg',
    'img/portada_login/portada_login9.jpg',

  ];

  constructor(private router: Router, private renderer: Renderer2, private loginService: LoginService) { }

  ngOnInit(): void {
    this.changeBackgroundImage()
  }

  getRandomImageIndex(): number {
    return Math.floor(Math.random() * this.imagePaths.length);
  }

  changeBackgroundImage(): void {
    const backgroundContainer = document.getElementById('background-container');
    const randomImageIndex = this.getRandomImageIndex();
    const randomImagePath = this.imagePaths[randomImageIndex];
    if (backgroundContainer) {
      backgroundContainer.style.backgroundImage = `url(${randomImagePath})`;
    }
    else{
      console.log('el backgroundContainer no existe')
    }
  }

  preloadImages(imageSrcList: string[]): void {
    imageSrcList.forEach(src => {
      const img = this.renderer.createElement('img');
      this.renderer.setAttribute(img, 'src', src);
      this.renderer.setStyle(img, 'display', 'none');
      this.renderer.appendChild(document.body, img);
    });
  }

  async login() {
    try {
      // Convertimos el observable en una promesa con firstValueFrom
      const authResponse = await firstValueFrom(this.loginService.login(this.credentials));
      if (authResponse) {
        // console.log('Se logueó correctamente: ' + this.loginService.isAuthenticatedUser());
        this.router.navigate(['principal']);
      } else {
        alert(this.loginService.showMessage());
      }
    } catch (error) {
      console.error(error);
      alert('Error al intentar autenticar');
    }
  }
}

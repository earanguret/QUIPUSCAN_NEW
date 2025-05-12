import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  credentials: any = {
    usuario: '',
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

  constructor(private router: Router, private renderer: Renderer2) { }

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
    
  }
}

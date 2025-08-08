import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<h1>Testando conexão com a API...</h1>`,
  styles: [],
})
export class AppComponent {
  private http = inject(HttpClient);

  constructor() {
    this.http.get(`${environment.apiUrl}/notificacao/status/test-id`).subscribe({
      next: (res) => console.log('Conexão bem-sucedida!', res),
      error: (err) => console.error('Erro na conexão:', err),
    });
  }
}
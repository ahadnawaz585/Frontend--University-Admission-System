import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  constructor(private router: Router) {}

  @Output() sidebarToggle = new EventEmitter<boolean>();
  isOpen: boolean = false;

  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
    this.sidebarToggle.emit(this.isOpen);
  }

  closeSidebar(): void {
    if (this.isOpen) {
      this.isOpen = false;
      this.sidebarToggle.emit(this.isOpen);
    }
  }
}

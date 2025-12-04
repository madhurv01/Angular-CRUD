import { Component, Input, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  @Input() employees: any[] = [];   // Option A: receive from parent

  // Option B: load directly from localStorage
  ngOnInit() {
    if (this.employees.length === 0) {
      const saved = localStorage.getItem("employees");
      this.employees = saved ? JSON.parse(saved) : [];
    }
  }

  search = '';

  get filtered() {
    const s = this.search.toLowerCase();
    return this.employees.filter(e =>
      e.name.toLowerCase().includes(s) ||
      e.email.toLowerCase().includes(s) ||
      e.department.toLowerCase().includes(s)
    );
  }
}

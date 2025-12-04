import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type Emp = {
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
  location: string;
  team: string;
  manager?: boolean;
  active?: boolean;
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private router: Router) {}


  employees: Emp[] = [];
  filteredTotal = 0;
  displayedEmployees: Emp[] = [];

  uniqueValues: {
    department: string[];
    role: string[];
    location: string[];
    team: string[];
  } = { department: [], role: [], location: [], team: [] };

  filters: any = { department: '', role: '', location: '', team: '' };
  searchTerm = '';
  sortBy = 'name';
  page = 1;
  pageSize = 8;
  totalPages = 1;

  /* SIDEBAR STATE */
  sidebarCollapsed = false;
  sidebarSearch = '';

  /* MODAL SYSTEM */
  modalOpen = false;
  modalType: string | null = null;
  modalTitle = '';
  modalData: any = null;

  /* ADD / EDIT EMPLOYEE FORM FIELDS */
  formName = '';
  formEmail = '';
  formDepartment = '';
  formRole = '';
  formLocation = '';
  formTeam = '';
  formActive = true;
  formMessage = '';

  ngOnInit(): void {
  const saved = localStorage.getItem('employees');

  if (saved) {
    this.employees = JSON.parse(saved);
  } else {
    this.employees = [
      { id:1, name:'Alice Johnson', email:'alice.j@company.com', department:'Engineering', role:'Engineer', location:'Headquarters', team:'Alpha', active:true },
      { id:2, name:'Brian Lee', email:'brian.l@company.com', department:'Sales', role:'Manager', location:'North Region', team:'Beta', manager:true, active:true },
      { id:3, name:'Carmen Wu', email:'carmen.w@company.com', department:'Human Resources', role:'HR Admin', location:'Headquarters', team:'Gamma', active:true },
      { id:4, name:'Daniel Park', email:'daniel.p@company.com', department:'Engineering', role:'IT Support', location:'Remote', team:'Alpha', active:true },
      { id:5, name:'Eva Rivera', email:'eva.r@company.com', department:'Finance', role:'Analyst', location:'South Region', team:'Delta', active:false },
      { id:6, name:'Frank Moore', email:'frank.m@company.com', department:'Engineering', role:'Manager', location:'Headquarters', team:'Alpha', manager:true, active:true },
      { id:7, name:'Grace Kim', email:'grace.k@company.com', department:'Sales', role:'Employee', location:'Remote', team:'Beta', active:true },
      { id:8, name:'Hassan Ali', email:'hassan.a@company.com', department:'Engineering', role:'Engineer', location:'North Region', team:'Gamma', active:true },
      { id:9, name:'Isabel Cruz', email:'isabel.c@company.com', department:'Human Resources', role:'Employee', location:'South Region', team:'Delta', active:true },
      { id:10, name:'Jon Perez', email:'jon.p@company.com', department:'Finance', role:'Manager', location:'Headquarters', team:'Delta', active:true },
    ];
  }

  this.prepareUniqueValues();
  this.apply();
}


  prepareUniqueValues() {
    const set = (k: keyof Emp): string[] =>
      Array.from(new Set(this.employees.map(e => String(e[k])))).sort();

    this.uniqueValues.department = set('department');
    this.uniqueValues.role = set('role');
    this.uniqueValues.location = set('location');
    this.uniqueValues.team = set('team');
  }

  uniqueCount(key: string) {
    return (this.uniqueValues as any)[key]?.length || 0;
  }

  /* SIDEBAR TOGGLE */
  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  /* SEARCH / FILTER / SORT / PAGINATION */
  onSearch(term: string) {
    this.searchTerm = (term || '').trim().toLowerCase();
    this.page = 1;
    this.apply();
  }

  onFilterChange(key: string, value: string) {
    this.filters[key] = value || '';
    this.page = 1;
    this.apply();
  }

  onSort(sort: string) {
    this.sortBy = sort || 'name';
    this.apply();
  }

  apply() {
    let list = this.employees.slice();

    if (this.searchTerm) {
      list = list.filter(e =>
        e.name.toLowerCase().includes(this.searchTerm) ||
        e.email.toLowerCase().includes(this.searchTerm)
      );
    }

    Object.keys(this.filters).forEach(k => {
      const v = this.filters[k];
      if (v) list = list.filter((e:any) => String((e as any)[k]).toLowerCase() === (v+'').toLowerCase());
    });

    list.sort((a:any,b:any) => {
      const A = (a as any)[this.sortBy] || '';
      const B = (b as any)[this.sortBy] || '';
      return String(A).localeCompare(String(B));
    });

    this.filteredTotal = list.length;
    this.totalPages = Math.max(1, Math.ceil(list.length / this.pageSize));
    if (this.page > this.totalPages) this.page = this.totalPages;

    const start = (this.page - 1) * this.pageSize;
    this.displayedEmployees = list.slice(start, start + this.pageSize);
  }

  changePage(delta:number) {
    this.page = Math.max(1, Math.min(this.totalPages, this.page + delta));
    this.apply();
  }

  /* MODAL SYSTEM */
  openModal(type:string, data:any = null) {
    this.modalType = type;
    this.modalData = data;
    this.modalOpen = true;

    // default title mapping
    if (type === 'details') this.modalTitle = 'Employee Details';
    if (type === 'impersonate') this.modalTitle = 'Impersonate Employee';
    if (type === 'add') this.modalTitle = 'Add Employee';
    if (type === 'announcement') this.modalTitle = 'Send Announcement';
    if (type === 'deactivateConfirm') this.modalTitle = 'Deactivate Employees';
    if (type === 'delete') this.modalTitle = 'Delete Employee';
    if (type === 'edit') this.modalTitle = 'Edit Employee';

    // Pre-fill form fields for edit
    if (type === 'edit' && data) {
      this.formName = data.name || '';
      this.formEmail = data.email || '';
      this.formDepartment = data.department || (this.uniqueValues.department[0] || '');
      this.formRole = data.role || (this.uniqueValues.role[0] || '');
      this.formLocation = data.location || (this.uniqueValues.location[0] || '');
      this.formTeam = data.team || (this.uniqueValues.team[0] || '');
      this.formActive = (data.active === undefined) ? true : !!data.active;
    }

    // Pre-fill add form with sensible defaults
    if (type === 'add') {
      this.formDepartment = this.uniqueValues.department[0] || '';
      this.formRole = this.uniqueValues.role[0] || '';
      this.formLocation = this.uniqueValues.location[0] || '';
      this.formTeam = this.uniqueValues.team[0] || '';
      this.formActive = true;
      this.formName = '';
      this.formEmail = '';
    }

    // prefill announcement
    if (type === 'announcement') {
      this.formMessage = '';
    }
  }

  closeModal() {
    this.modalOpen = false;
    this.modalType = null;
    this.modalData = null;

    this.formName = '';
    this.formEmail = '';
    this.formDepartment = '';
    this.formRole = '';
    this.formLocation = '';
    this.formTeam = '';
    this.formActive = true;
    this.formMessage = '';
  }

  impersonateConfirm() {
    console.log("Impersonating:", this.modalData);
    this.closeModal();
  }

  addEmployeeConfirm() {
    if (!this.formName || !this.formEmail) return;

    const nextId = this.employees.length ? Math.max(...this.employees.map(e => e.id)) + 1 : 1;

    this.employees.push({
      id: nextId,
      name: this.formName,
      email: this.formEmail,
      department: this.formDepartment || 'Engineering',
      role: this.formRole || 'Employee',
      location: this.formLocation || 'Headquarters',
      team: this.formTeam || 'Alpha',
      active: this.formActive
    });

    this.prepareUniqueValues();
    this.save();
    this.apply();
    this.closeModal();
  }

  sendAnnouncementConfirm() {
    console.log("Announcement:", this.formMessage);
    this.closeModal();
  }

  bulkDeactivateConfirm() {
    const ids = this.displayedEmployees.map(x => x.id);
    this.employees = this.employees.map(e => ids.includes(e.id) ? ({...e, active:false}) : e);
    this.save();
    this.apply();
    this.closeModal();
  }

  /* ========= UPDATE (EDIT) ========= */
  editEmployeeConfirm() {
    if (!this.modalData) return;

    const id = this.modalData.id;
    const index = this.employees.findIndex(e => e.id === id);
    if (index === -1) return;

    this.employees[index] = {
      ...this.employees[index],
      name: this.formName,
      email: this.formEmail,
      department: this.formDepartment,
      role: this.formRole,
      location: this.formLocation,
      team: this.formTeam,
      active: this.formActive
    };

    this.prepareUniqueValues();
    this.save();
    this.apply();
    this.closeModal();
  }

  /* ========= HARD DELETE ========= */
  deleteEmployeeConfirm() {
    if (!this.modalData) return;

    const id = this.modalData.id;
    this.employees = this.employees.filter(e => e.id !== id);

    this.prepareUniqueValues();
    this.save();
    this.apply();
    this.closeModal();
  }
  openView()
  {
    this.router.navigate(['/view']);
  }
  openAnalysis(){
    this.router.navigate(['/analysis']);
  }
  openMail(){
    this.router.navigate(['/mail']);
  }
  save() {
  localStorage.setItem('employees', JSON.stringify(this.employees));
}


  exportCsv() {
    const rows = [
      ['id','name','email','department','role','location','team','manager','active'],
      ...this.employees.map(e => [e.id,e.name,e.email,e.department,e.role,e.location,e.team, !!e.manager, !!e.active])
    ];
    const csv = rows.map(r => r.map(v => `"${(''+v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employees.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.css']
})
export class MailComponent {

  activeView = 'compose'; // compose | inbox | sent | drafts | trash

  employees: any[] = [];
  selectedRecipients: string[] = [];

  subject = "";
  message = "";

  sentMails: any[] = [];

  constructor() {}

  ngOnInit(): void {
    const saved = localStorage.getItem('employees');
    this.employees = saved ? JSON.parse(saved) : [];

    const history = localStorage.getItem('sentMails');
    this.sentMails = history ? JSON.parse(history) : [];
  }

  setView(view: string) {
    this.activeView = view;
  }

  toggleRecipient(email: string) {
    if (this.selectedRecipients.includes(email)) {
      this.selectedRecipients = this.selectedRecipients.filter(e => e !== email);
    } else {
      this.selectedRecipients.push(email);
    }
  }

  sendMail() {
    if (!this.subject || !this.message || this.selectedRecipients.length === 0) {
      alert("Please fill all fields!");
      return;
    }

    const mailObj = {
      id: Date.now(),
      to: [...this.selectedRecipients],
      subject: this.subject,
      message: this.message,
      date: new Date().toLocaleString()
    };

    this.sentMails.unshift(mailObj);
    localStorage.setItem("sentMails", JSON.stringify(this.sentMails));

    // reset form
    this.subject = "";
    this.message = "";
    this.selectedRecipients = [];

    alert("Mail Sent!");

    // after send → auto navigate to sent tab
    this.activeView = 'sent';
  }
}

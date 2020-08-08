import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.less'],
  providers: [MessageService, ConfirmationService]
})
export class ListUsersComponent implements OnInit {

  public users = [];

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    if (!this.getUsersFromCache() || !JSON.parse(this.getUsersFromCache()).length) {
      this.userService.getUsers().subscribe(
        (response: any) => {
          this.users = response.data;
          localStorage.setItem('persons', JSON.stringify(this.users));
        },
        err => {
          console.log(err);
        }
      );
    } else {
      this.users = JSON.parse(this.getUsersFromCache());
    }
  }

  getUsersFromCache(): string {
    return localStorage.getItem('persons');
  }

  deleteUser(id): void {
    console.log(id);
    this.confirmationService.confirm({
      message: 'Confirma a exclusão deste usuário?',
      header: 'Confirme',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        const persons = JSON.parse(localStorage.getItem('persons'));
        const index = persons.findIndex(el => Number(el.id) === Number(id));
        if (index > -1) {
          persons.splice(index, 1);
          localStorage.setItem('persons', JSON.stringify(persons));
          this.users = persons;
          this.messageService.add({ severity: 'success', summary: 'Ok!', detail: 'Usuário excluído!' });
        } else {
          this.messageService.add({ severity: 'warn', summary: 'Atenção:', detail: 'Usuário não encontrado!' });
        }
      },
      reject: () => {}
    });
  }
}

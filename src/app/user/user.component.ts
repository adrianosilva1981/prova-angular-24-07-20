import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ZipCodeService } from '../services/zip-code.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less'],
  providers: [MessageService]
})
export class UserComponent implements OnInit {

  public loading = false;
  public userForm = new FormGroup({
    id: new FormControl(
      { value: 0, disabled: false }, Validators.compose([Validators.required])
    ),
    name: new FormControl(
      { value: null, disabled: false }, Validators.compose([Validators.required, Validators.minLength(2)])
    ),
    cpf: new FormControl(
      { value: null, disabled: false }, Validators.compose([Validators.required, Validators.minLength(11)])
    ),
    phone: new FormControl(
      { value: null, disabled: false }, Validators.compose([Validators.required, Validators.minLength(10)])
    ),
    email: new FormControl(
      { value: null, disabled: false }, Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEX)])
    ),
    cep: new FormControl(
      { value: null, disabled: false }, Validators.compose([Validators.required, Validators.minLength(6)])
    ),
    state: new FormControl(
      { value: null, disabled: true }, Validators.compose([Validators.required])
    ),
    city: new FormControl(
      { value: null, disabled: true }, Validators.compose([Validators.required])
    ),
    street: new FormControl(
      { value: null, disabled: false }, Validators.compose([Validators.required])
    )
  });

  constructor(
    private zipCodeService: ZipCodeService,
    private router: ActivatedRoute,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    const idUser = this.router.snapshot.paramMap.get('id');
    if (idUser) {
      const user = this.getUser(idUser);
      if (user) {
        // tslint:disable-next-line: forin
        for (const key in this.userForm.value) {
          this.userForm.get(key).setValue(user[key]);
        }
        this.searchZipCode();
      }
    }
  }

  getUser(id): {} {
    const users = JSON.parse(localStorage.getItem('persons'));
    const index = users.findIndex(el => {
      return Number(el.id) === Number(id);
    });
    if (index > -1) { return users[index]; }
    return null;
  }

  searchZipCode(): void {
    if (this.userForm.get('cep').valid) {
      this.loading = true;
      this.zipCodeService.getCep(this.userForm.get('cep').value).then(
        (response: any) => {
          if (response.erro) {
            alert('Cep não encontrado');
            this.userForm.get('state').setValue('');
            this.userForm.get('city').setValue('');
            this.userForm.get('street').setValue('');
          } else {
            this.userForm.get('state').setValue(response.uf);
            this.userForm.get('city').setValue(response.localidade);
            this.userForm.get('street').setValue(response.logradouro);
          }
        }
      ).catch(error => {
        alert('Erro ao buscar o cep');
        console.error(error);
      }).finally(() => this.loading = false);
    } else {
      this.userForm.get('state').setValue('');
      this.userForm.get('city').setValue('');
      this.userForm.get('street').setValue('');
    }
  }

  saveUser(): void {
    const persons = JSON.parse(localStorage.getItem('persons'));
    // edit
    if (this.userForm.get('id').value > 0) {
      const i = persons.findIndex(el => {
        return ((el.id !== this.userForm.get('id').value) && (el.cpf === this.userForm.get('cpf').value));
      });
      if (i > -1) {
        this.messageService.add({ severity: 'warn', summary: 'Aviso:', detail: 'CPF já existe!' });
      } else {
        const j = persons.findIndex(el => el.id === this.userForm.get('id').value);
        persons[j] = this.userForm.value;
        localStorage.setItem('persons', JSON.stringify(persons));
        this.messageService.add({ severity: 'success', summary: 'Ok!', detail: 'Usuário atualizado!' });
      }
    // new
    } else {
      const index = persons.findIndex(el => el.cpf === this.userForm.get('cpf').value);
      if (index === -1) {
        this.userForm.get('id').setValue((new Date()).getTime());
        persons.push(this.userForm.value);
        localStorage.setItem('persons', JSON.stringify(persons));
        this.messageService.add({ severity: 'success', summary: 'Ok!', detail: 'Usuário incluído com sucesso!' });
      } else {
        this.messageService.add({ severity: 'warn', summary: 'Aviso:', detail: 'Usuário já existe!' });
      }
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';



@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  users = [];
  signupDone = false
  emailPattern: any = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    if (localStorage.getItem('users') !== null) {
      this.users = JSON.parse(localStorage.getItem('users'))
    } else {
      localStorage.setItem('users', (JSON.stringify(this.users)))
    }
  }
  signUpForm = this.formBuilder.group({
    'email': [{ value: null, disabled: false }, [Validators.required, this.noWhitespaceValidator, Validators.pattern(this.emailPattern)]],

  });

  startQuiz(userEmail) {
    
    let isPresent = false
    this.users.forEach((user) => {
      if (user === userEmail.value) {
        isPresent = true
      }
    })
    if (!isPresent) {
      this.users.push(userEmail.value)
      localStorage.setItem('users', JSON.stringify(this.users));
      localStorage.setItem('currentUser', userEmail.value);
      this.signupDone = true;
    } else {
      alert("User already Present!")
    }
    // if(this.signupDone && this.signUpForm.controls['email'].valid)
    // this.signUpForm.controls['email'].disable() 


  }
  enterQuiz() {

    this.router.navigate(['contest']);
  }
  /*check for white spaces*/
  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }



}

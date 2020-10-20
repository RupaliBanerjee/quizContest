import { Component, OnInit, ViewChild } from '@angular/core';
import * as questionDb from './questionStore.json';
import * as optionDB from './optionStore.json';
import { BehaviorSubject } from 'rxjs';
import { CountdownComponent } from 'ngx-countdown';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contest',
  templateUrl: './contest.component.html',
  styleUrls: ['./contest.component.scss']
})
export class ContestComponent implements OnInit {

  favoriteSeason: string;
  seasons: string[] = ['Winter', 'Spring', 'Summer', 'Autumn'];

  questionStore: any = (questionDb as any).default;
  optionStore: any = (optionDB as any).default;
  displayQuestions;
  displayOptions;
  questionsObj;
  questionId;
  question;
  options;
  userAnswers = [];
  counter = 0;
  totalPoints;
  showSubmit;
  showScoreGoBack: boolean = false;
  @ViewChild('cd', { static: false }) private countdown: CountdownComponent;




  constructor(private router: Router) { }

  ngOnInit(): void {
    localStorage.setItem('questionStore', JSON.stringify(this.questionStore));
    localStorage.setItem('optionStore', JSON.stringify(this.optionStore));
    //for user answers
    if (localStorage.getItem('userAnswers') !== null) {
      this.userAnswers = JSON.parse(localStorage.getItem('userAnswers'))
    } else {
      localStorage.setItem('userAnswers', (JSON.stringify(this.userAnswers)))
    }
    this.showQuestions();

  }
  showQuestions() {
    this.counter++;

    this.showSubmit = this.counter == 5 ? true : false
    this.displayQuestions = JSON.parse(localStorage.getItem('questionStore'));
    this.displayOptions = JSON.parse(localStorage.getItem('optionStore'));
    let visit = 0
    this.displayQuestions.forEach(item => {
      if (item.isVisited == false && visit == 0) {
        this.questionId = item.quesId;
        this.question = item.question;
        visit = 1
        item.isVisited = true;

      }
    });
    localStorage.setItem('questionStore', JSON.stringify(this.displayQuestions));
    this.displayOptions.forEach(item => {
      if (this.questionId == item.questionId) {
        this.options = item.options
      }
    });
    //this.countdown.begin();
  }
  goToNextQuestion() {

    this.showQuestions();
    this.countdown.restart();

  }
  onAnswerSelected(value, option) {

    let userAnsOBJUpdated = false;//check if old or new user

    this.userAnswers.forEach(ans => {

      //when users had answered some questions previously
      if (ans.userId === localStorage.getItem('currentUser')) {
        userAnsOBJUpdated = true
        let questionExist = false //check if question answered or not
        ans.attemptedQuestion.forEach(element => {
          //if the user have answered a specific question 
          if (element.questionId === this.questionId) {
            element.optionId = option.optId;
            element.isCorrect = option.isCorrect;
            if (option.isCorrect == true)
              element.pointsEarned = 100;
            else
              element.pointsEarned = 0;
            questionExist = true

          }
        });
        //if this question is newly answered for existing User (add in the attempted Qtn object)
        if (!questionExist) {
          let questionStatus = {};//to passs to the attemptedQtn
          questionStatus["questionId"] = this.questionId;
          questionStatus['optionId'] = option.optId;
          questionStatus['isCorrect'] = option.isCorrect;
          if (option.isCorrect == true)
            questionStatus['pointsEarned'] = 100;
          else
            questionStatus['pointsEarned'] = 0;
          //set the usermail id as unique Identifier

          ans.attemptedQuestion.push(questionStatus)
        }

        //ifquestion exist false add logic inside the if condition
      }
    })


    //when the user is newly logged in and have not answered any question
    if (!userAnsOBJUpdated) {
      this.createNewUserInAnsObj(option)
    }
    //Updating Local storage for userAnswers
    localStorage.setItem('userAnswers', (JSON.stringify(this.userAnswers)))
  }

  createNewUserInAnsObj(option) {
    let answerObj = {};// to send the userAnswerDB
    let attemptedQtn = [];//to check which question attempted
    let questionStatus = {};//to passs to the attemptedQtn

    questionStatus["questionId"] = this.questionId;
    questionStatus['optionId'] = option.optId;
    questionStatus['isCorrect'] = option.isCorrect;
    if (option.isCorrect == true)
      questionStatus['pointsEarned'] = 100;
    else
      questionStatus['pointsEarned'] = 0;
    //set the usermail id as unique Identifier
    answerObj['userId'] = localStorage.getItem('currentUser');
    attemptedQtn.push(questionStatus)
    answerObj['attemptedQuestion'] = attemptedQtn;
    this.userAnswers.push(answerObj);

  }
  calculateScore() {
    this.counter = 0;
    this.totalPoints = 0;
    let userAnswers = JSON.parse(localStorage.getItem('userAnswers'));
    userAnswers.forEach(element => {
      if (element.userId === localStorage.getItem('currentUser')) {
        element.attemptedQuestion.forEach(element => {
          this.totalPoints += element.pointsEarned;
        });
      }

    });
    this.showScoreGoBack = true
  }
  handleEvent(event) {
    if (event.action == 'notify') {
      this.goToNextQuestion();
      this.countdown.restart();
    }
    console.log(event)

  }
  goToSignUp() {
    this.router.navigate(['signup']);
  }
}

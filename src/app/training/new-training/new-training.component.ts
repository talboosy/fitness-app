import { Component, OnInit, OnDestroy } from "@angular/core";
import { TrainingService } from "../training.service";
import { Exercise } from "../exercise.model";
import { NgForm, FormGroup, FormControl, Validators } from "@angular/forms";
import { AngularFirestore } from "angularfire2/firestore";
import { Observable, Subscription } from "rxjs";
import "rxjs/add/operator/map";

@Component({
  selector: "app-new-training",
  templateUrl: "./new-training.component.html",
  styleUrls: ["./new-training.component.css"]
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises: Exercise[];
  exerciseSubscription: Subscription;
  newExerciseForm: FormGroup;

  constructor(
    private trainingService: TrainingService,
    private db: AngularFirestore
  ) {}

  ngOnInit() {
    this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(
      exercises => (this.exercises = exercises)
    );
    this.trainingService.fetchAvailableExercises();
    this.newExerciseForm = new FormGroup({
      newExercise: new FormControl(""),
      newExerciseCalories: new FormControl(""),
      newExerciseDuration: new FormControl("")
    });
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  onAddExercise() {
    this.trainingService.addNewExercise(
      this.newExerciseForm.value.newExercise,
      this.newExerciseForm.value.newExerciseCalories,
      this.newExerciseForm.value.newExerciseDuration
    );
    console.log(this.newExerciseForm.value);
  }

  ngOnDestroy() {
    this.exerciseSubscription.unsubscribe();
  }
}

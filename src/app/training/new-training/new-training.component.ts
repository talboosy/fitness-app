import { Component, OnInit, OnDestroy } from "@angular/core";
import { TrainingService } from "../training.service";
import { Exercise } from "../exercise.model";
import { NgForm, FormGroup, FormControl, Validators } from "@angular/forms";
import { AngularFirestore } from "angularfire2/firestore";
import { Observable, Subscription } from "rxjs";
import "rxjs/add/operator/map";
import { UIService } from "src/app/shared/ui.service";

@Component({
  selector: "app-new-training",
  templateUrl: "./new-training.component.html",
  styleUrls: ["./new-training.component.css"]
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises: Exercise[];
  private exerciseSubscription: Subscription;
  newExerciseForm: FormGroup;
  isLoading = true;
  private loadingSubs: Subscription;

  constructor(
    private trainingService: TrainingService,
    private db: AngularFirestore,
    private uiService: UIService
  ) {}

  ngOnInit() {
    this.loadingSubs = this.uiService.loadingStateChanged.subscribe(
      isLoading => {
        this.isLoading = isLoading;
      }
    );
    this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(
      exercises => {
        this.exercises = exercises;
      }
    );
    this.fetchExercises();
    this.newExerciseForm = new FormGroup({
      newExercise: new FormControl(""),
      newExerciseCalories: new FormControl(""),
      newExerciseDuration: new FormControl("")
    });
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  onAddExercise() {
    this.trainingService.addNewExercise(
      this.newExerciseForm.value.newExercise,
      this.newExerciseForm.value.newExerciseCalories,
      this.newExerciseForm.value.newExerciseDuration
    )
    console.log(this.newExerciseForm.value);
    this.newExerciseForm.reset();
    for (let name in this.newExerciseForm.controls) {
      this.newExerciseForm.controls[name].setErrors(null);
   }

  }

  ngOnDestroy() {
    if (this.exerciseSubscription) {
      this.exerciseSubscription.unsubscribe();
    }
    if (this.loadingSubs) {
      this.loadingSubs.unsubscribe();
    }
  }
}

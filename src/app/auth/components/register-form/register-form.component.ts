import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Alcohol, ALCOHOLS } from 'src/app/shared/consts/alcohols.consts';
import { CITIES, City } from 'src/app/shared/consts/cities.consts';
import { HOBBIES, Hobby } from 'src/app/shared/consts/hobbies.consts';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterFormComponent {
  public readonly City = City;
  public readonly CITIES = CITIES;
  public readonly Alcohol = Alcohol;
  public readonly ALCOHOLS = ALCOHOLS;
  public readonly Hobby = Hobby;
  public readonly HOBBIES = HOBBIES;

  public loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(16),
    ]),
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(16),
      Validators.pattern('^[a-zA-Z]*$'),
    ]),
    birthDate: new FormControl<Date | null>(null, Validators.required),
    city: new FormControl<City | null>(null, Validators.required),
    hobbies: new FormControl<Hobby[] | null>([], Validators.required),
    alcohols: new FormControl<Alcohol[] | null>([], Validators.required),
  });

  public get isEmailValid(): boolean {
    return this.loginForm.get('email')!.valid;
  }

  public get isPasswordValid(): boolean {
    return this.loginForm.get('password')!.valid;
  }

  public get isNameValid(): boolean {
    return this.loginForm.get('name')!.valid;
  }

  public get selectedCity(): City | null {
    return this.loginForm.get('city')!.value;
  }

  public get selectedAlcohols(): Alcohol[] | null {
    return this.loginForm.get('alcohols')!.value;
  }

  public get selectedHobbies(): Hobby[] | null {
    return this.loginForm.get('hobbies')!.value;
  }

  public setCity(city: City): void {
    this.loginForm.get('city')?.setValue(city);
  }

  public setBirthDate(date: Date): void {
    this.loginForm.get('birthDate')?.setValue(date);
  }

  public setHobbies(hobbies: Hobby[]): void {
    this.loginForm.get('hobbies')?.setValue(hobbies);
  }

  public setAlcohols(alcohols: Alcohol[]): void {
    this.loginForm.get('alcohols')?.setValue(alcohols);
  }
}

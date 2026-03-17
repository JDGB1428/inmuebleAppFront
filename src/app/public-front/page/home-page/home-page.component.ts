import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeroComponent } from "../../component/hero/hero.component";
import { FeaturesComponent } from "../../component/features/features.component";
import { HowItWorksComponent } from "../../component/how-it-works/how-it-works.component";
import { FooterComponent } from "../../component/footer/footer.component";
import { FaqComponent } from "../../component/faq/faq.component";
import { Navbar } from "../../../shared/component/navbar/navbar.component";
import { PricingComponent } from "../../component/pricing/pricing.component";

@Component({
  selector: 'app-home-page',
  imports: [HeroComponent, FeaturesComponent, HowItWorksComponent, FooterComponent, FaqComponent, Navbar, PricingComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {

}

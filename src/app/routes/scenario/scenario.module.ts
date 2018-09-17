import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { SharedModule } from '@shared/shared.module'
import { MonacoEditorModule } from 'ngx-monaco-editor'

import { CaseModule } from '../case/case.module'
import { ScenarioModelComponent } from './scenario-model/scenario-model.component'
import { ScenarioRoutingModule } from './scenario-routing.module'
import { StepsSelectorComponent } from './steps-selector/steps-selector.component'

const COMPONENT = [
  ScenarioModelComponent,
  StepsSelectorComponent,
]

const COMPONENT_NOROUNT = []

@NgModule({
  imports: [
    CommonModule,
    MonacoEditorModule,
    SharedModule,
    ScenarioRoutingModule,
    CaseModule
  ],
  providers: [],
  declarations: [...COMPONENT, ...COMPONENT_NOROUNT],
  entryComponents: COMPONENT_NOROUNT,
})
export class ScenarioModule { }
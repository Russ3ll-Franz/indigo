import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { SharedModule } from '@shared/shared.module'
import { MonacoEditorModule } from 'ngx-monaco-editor'

import { ProjectOpenapiComponent } from './project-openapi/project-openapi.component'
import { ProjectRoutingModule } from './project-routing.module'
import { ProjectSettingsComponent } from './project-settings/project-settings.component'


const COMPONENT = [
  ProjectSettingsComponent,
  ProjectOpenapiComponent,
]

const COMPONENT_NOROUNT = []

@NgModule({
  imports: [
    CommonModule,
    MonacoEditorModule,
    SharedModule,
    ProjectRoutingModule
  ],
  providers: [],
  declarations: [...COMPONENT, ...COMPONENT_NOROUNT],
  entryComponents: COMPONENT_NOROUNT,
})
export class ProjectModule { }
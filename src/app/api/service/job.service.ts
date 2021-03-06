import { Inject, Injectable } from '@angular/core'
import { I18nKey } from '@core/i18n/i18n.message'
import { I18NService } from '@core/i18n/i18n.service'
import { DA_SERVICE_TOKEN, TokenService } from '@delon/auth'
import { _HttpClient } from '@delon/theme'
import { NzMessageService } from 'ng-zorro-antd'
import { Observable, Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

import { ApiRes, QueryPage } from '../../model/api.model'
import { IndexDocResponse, Job, JobNotify, JobReport, JobReportDataItem } from '../../model/es.model'
import { JobData, JobMeta, TriggerMeta } from '../../model/job.model'
import { newWS } from '../../util/ws'
import { API_JOB, API_JOB_CRON, API_JOB_QUERY, API_WS_JOB_TEST } from '../path'
import { AggsQuery, BaseService, TrendResponse } from './base.service'

@Injectable({
  providedIn: 'root'
})
export class JobService extends BaseService {

  constructor(
    private http: _HttpClient,
    private msgService: NzMessageService,
    private i18nService: I18NService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
  ) { super() }

  checkCron(cron: String) {
    return this.http.post(API_JOB_CRON, cron) as Observable<ApiRes<string[]>>
  }

  index(job: NewJob) {
    return this.http.put(API_JOB, job) as Observable<ApiRes<IndexDocResponse>>
  }

  update(id: string, job: NewJob) {
    return this.http.post(API_JOB, { id, ...job })
  }

  resume(op: JobOperation) {
    return this.http.post<ApiRes<Job[]>>(`${API_JOB}/resume`, op)
  }

  pause(op: JobOperation) {
    return this.http.post<ApiRes<Job[]>>(`${API_JOB}/pause`, op)
  }

  delete(op: JobOperation) {
    return this.http.post<ApiRes<Job[]>>(`${API_JOB}/delete`, op)
  }

  query(query: QueryJob) {
    return this.http.post<ApiRes<Job[]>>(API_JOB_QUERY, query)
  }

  getReportById(id: string) {
    return this.http.get<ApiRes<JobReport>>(`${API_JOB}/report/${id}`)
  }

  jobTrend(id: string) {
    return this.http.get<ApiRes<JobReport[]>>(`${API_JOB}/report/trend/${id}`)
  }

  trend(aggs: AggsQuery) {
    return this.http.post<ApiRes<TrendResponse>>(`${API_JOB}/report/trend`, aggs)
  }

  getReportItemById(day: string, id: string) {
    return this.http.get<ApiRes<JobReportDataItem>>(`${API_JOB}/report/item/${day}/${id}`)
  }

  queryReports(query: QueryJobReport) {
    return this.http.post<ApiRes<JobReport[]>>(`${API_JOB}/reports`, query)
  }

  getById(id: string) {
    return this.http.get<ApiRes<Job>>(`${API_JOB}/${id}`)
  }

  newQuerySubject(response: Subject<ApiRes<Job[]>>) {
    const querySubject = new Subject<QueryJob>()
    querySubject.pipe(debounceTime(this.DEFAULT_DEBOUNCE_TIME)).subscribe(query => {
      this.http.post<ApiRes<Job[]>>(API_JOB_QUERY, query).subscribe(
        res => response.next(res),
        err => response.error(err))
    })
    return querySubject
  }

  newTestWs(group: string, project: string, id: string) {
    let idParam = ''
    if (id) {
      idParam = `&id=${id}`
    }
    const ws = newWS(`${API_WS_JOB_TEST}/${group}/${project}?token=${this.tokenService.get()['token']}${idParam}`)
    ws.onerror = (event) => {
      console.error(event)
      this.msgService.warning(this.i18nService.fanyi(I18nKey.ErrorWsOnError))
    }
    return ws
  }

  getAllNotifiers() {
    return this.http.get<ApiRes<JobNotifyFunction[]>>(`${API_JOB}/notify`)
  }

  newSubscriber(subscriber: JobNotify) {
    return this.http.put<ApiRes<IndexDocResponse>>(`${API_JOB}/notify`, subscriber)
  }

  updateSubscriber(id: string, subscriber: JobNotify) {
    return this.http.post<ApiRes<IndexDocResponse>>(`${API_JOB}/notify/${id}`, subscriber)
  }

  querySubscribers(query: QueryJobNotify) {
    return this.http.post<ApiRes<JobNotify[]>>(`${API_JOB}/notify`, query)
  }

  deleteSubscriber(id: string) {
    return this.http.delete(`${API_JOB}/notify/${id}`)
  }

  getJobState(items: QueryJobStateItem[]) {
    return this.http.post<ApiRes<Object>>(`${API_JOB}/state`, { items: items })
  }
}

export interface QueryJob extends QueryPage {
  group?: string
  project?: string
  text?: string
  triggerType?: string
}

export interface NewJob {
  jobMeta?: JobMeta
  triggerMeta?: TriggerMeta
  jobData?: JobData
  notifies?: JobNotify[]
}

export interface QueryJobNotify extends QueryPage {
  group?: string
  project?: string
  jobId?: string
  subscriber?: string
  type?: string
  trigger?: string
  enabled?: boolean
}

export interface JobNotifyFunction {
  type?: string
  description?: string
}

export interface JobOperation {
  group?: string
  project?: string
  id?: string
}

export interface QueryJobStateItem {
  group?: string
  project?: string
  jobId?: string
}

export interface QueryJobReport {
  scheduler?: string
  group?: string
  project?: string
  text?: string
  classAlias?: string
  type?: string
  jobId?: string
  result?: string
  timeStart?: string
  timeEnd?: string
  from?: number
  size?: number
}

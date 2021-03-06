import { Injectable } from '@angular/core'
import { _HttpClient } from '@delon/theme'
import { Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

import { ApiRes } from '../../model/api.model'
import { API_ACTIVITY } from '../path'
import { AggsItem, AggsQuery, BaseService, TrendResponse } from './base.service'

@Injectable({
  providedIn: 'root'
})
export class ActivityService extends BaseService {

  constructor(private http: _HttpClient) { super() }

  trend(aggs: AggsQuery) {
    return this.http.post<ApiRes<TrendResponse>>(`${API_ACTIVITY}/aggs/trend`, aggs)
  }

  aggTermsSubject(response: Subject<ApiRes<AggsItem[]>>) {
    const querySubject = new Subject<AggsQuery>()
    querySubject.pipe(debounceTime(this.DEFAULT_DEBOUNCE_TIME)).subscribe(query => {
      this.http.post<ApiRes<AggsItem[]>>(`${API_ACTIVITY}/aggs/terms`, query).subscribe(
        res => response.next(res),
        err => response.error(err))
    })
    return querySubject
  }
}

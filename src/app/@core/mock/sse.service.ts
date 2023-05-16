import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SseService {
    constructor(private zone: NgZone) {}
    
    getEventSource(url: string): EventSource {
        return new EventSource(url);
    }

    // getServerSentEvent(url: string){
    //     return Observable.create(observer => {
    //         const eventSource = this.getEventSource(url);
    //         eventSource.onmessage = event => {
    //             this.zone.run(()=>{
    //                 observer.next(event);
    //             });
    //         };

    //         eventSource.onerror = error => {
    //             this.zone.run( () => {
    //                 observer.error(error);
    //             })
    //         }
    //     })
    // }

    getServerSentEvent(url: string): Observable<MessageEvent> {
        return new Observable(observer => {
            const eventSource = this.getEventSource(url);

            eventSource.onmessage = event => {
                this.zone.run(() => observer.next(event));
            };

            eventSource.onerror = error => {
                this.zone.run(()=>{
                    observer.error(error);
                });
            }
        });
    }
}
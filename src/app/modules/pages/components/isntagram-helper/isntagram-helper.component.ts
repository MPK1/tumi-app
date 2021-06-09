import { Component, OnInit, ChangeDetectionStrategy, ViewChild, AfterViewInit, ElementRef } from "@angular/core";
import { EventService } from "@tumi/services";
import { startOfToday } from "date-fns";
import { map } from "rxjs/operators";
import { fromEvent, Observable } from "rxjs";
import { format } from "date-fns/esm";

@Component({
  selector: 'app-isntagram-helper',
  templateUrl: './isntagram-helper.component.html',
  styleUrls: ['./isntagram-helper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IsntagramHelperComponent implements OnInit, AfterViewInit {
@ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
events$:Observable<any[]>;
  constructor(private events: EventService) { }

  ngOnInit(): void {
    this.events$ = this.events.upcomingOfTypes$({ types: ["event"], date: startOfToday() }).pipe(map(events => events.filter(event => event.visibility === 'public')))
  }

  ngAfterViewInit() {
    console.log(this.canvas);
    const context = this.canvas.nativeElement.getContext('2d');
    if(!context) return;
    this.events$.subscribe(async events => {
      context.fillStyle = '#000'
      context.fillRect(0, 0, 1080, 1920)
      const bgImage = new Image(1080,1920);
      bgImage.src='/assets/images/background.jpg';
      bgImage.addEventListener('load', () =>{
        context.drawImage(bgImage, 0,0, 1080, 1920);
        const text = 'Upcoming TUMi Events'

        context.font = 'bold 60pt sans-serif'
        context.textAlign = 'center'
        context.fillStyle = '#fff'
        context.fillText(text, 540, 200)

        events.forEach((event, index)=>{
          const offset = 300 + index*200;
          context.globalAlpha = 0.4;
          context.fillStyle = '#fff'
          context.fillRect(25,offset+25,1030,150);
          context.globalAlpha = 1.0;
          context.fillStyle = '#000'
          const [icon, style] = event.icon.split(':');
          const eventImage = new Image(100, 100);
          eventImage.src = `https://img.icons8.com/${style ?? 'color'}/150/${
            icon ?? ''
          }.png?token=9b757a847e9a44b7d84dc1c200a3b92ecf6274b2`;
          eventImage.addEventListener('load',()=>{
            context.drawImage(eventImage, 50, offset+25);
            context.font = 'normal 40pt sans-serif';
            context.textAlign = 'left';
            context.textBaseline = 'middle';
            const measure = context.measureText(event.name);
            context.fillText(event.name, 250, offset+75, 780);
            context.font = 'normal 30pt sans-serif';
            context.fillText(format(event.start,'EEEEEE dd MMM HH:mm'), 250, offset+130, 780);
          })
        })
      })

    })
  }

}

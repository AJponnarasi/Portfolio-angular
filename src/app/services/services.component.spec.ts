import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServicesComponent } from './services.component';

describe('ServicesComponent', () => {
  let component: ServicesComponent;
  let fixture: ComponentFixture<ServicesComponent>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ServicesComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a card per service with a zero-padded number', () => {
    const cards = el.querySelectorAll('.service-card');
    expect(cards.length).toBe(component.SERVICE_LIST.length);
    const nums = Array.from(el.querySelectorAll('.service-num')).map(n => n.textContent?.trim());
    expect(nums).toEqual(['01', '02', '03']);
  });

  it('should render each service title and its tech tags', () => {
    const cards = el.querySelectorAll('.service-card');
    component.SERVICE_LIST.forEach((service, i) => {
      expect(cards[i].querySelector('.card-title')?.textContent).toContain(service.title);
      expect(cards[i].querySelectorAll('.tech-tag').length).toBe(service.techStack.length);
    });
  });

  it('should track services by id', () => {
    const service = component.SERVICE_LIST[2];
    expect(component.trackByServiceId(0, service)).toBe(service.id);
  });
});

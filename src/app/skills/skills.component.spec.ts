import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkillsComponent } from './skills.component';

describe('SkillsComponent', () => {
  let component: SkillsComponent;
  let fixture: ComponentFixture<SkillsComponent>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SkillsComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  const cards = () => Array.from(el.querySelectorAll<HTMLButtonElement>('.skill-card'));
  const modal = () => el.querySelector('.modal-overlay');

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a card for every skill', () => {
    expect(cards().length).toBe(component.SKILLS_LIST.length);
    expect(cards()[0].querySelector('.card-title')?.textContent).toContain('Angular');
  });

  it('should have unique skill ids', () => {
    const ids = component.SKILLS_LIST.map(s => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should define a meter percentage for every experience level used', () => {
    for (const skill of component.SKILLS_LIST) {
      const pct = component.levelPercent[skill.experienceLevel];
      expect(pct).withContext(skill.id).toBeGreaterThan(0);
      expect(pct).withContext(skill.id).toBeLessThanOrEqual(100);
    }
  });

  it('should render the meter width from the experience level', () => {
    const fill = cards()[0].querySelector<HTMLElement>('.meter-fill')!;
    const expected = component.levelPercent[component.SKILLS_LIST[0].experienceLevel];
    expect(fill.style.width).toBe(`${expected}%`);
  });

  it('should not show the modal initially', () => {
    expect(modal()).toBeNull();
  });

  it('should open the modal with the clicked skill details', () => {
    cards()[1].click();
    fixture.detectChanges();

    const skill = component.SKILLS_LIST[1];
    expect(component.isModalOpen).toBeTrue();
    expect(component.selectedSkill).toBe(skill);
    expect(modal()?.querySelector('#skill-dialog-title')?.textContent).toContain(skill.title);
    expect(modal()?.querySelectorAll('.key-list li').length).toBe(skill.keySkills.length);
  });

  it('should close the modal via the close button', () => {
    component.openSkill(component.SKILLS_LIST[0]);
    fixture.detectChanges();
    el.querySelector<HTMLButtonElement>('.close-x')!.click();
    fixture.detectChanges();
    expect(modal()).toBeNull();
  });

  it('should close the modal when clicking the backdrop but not the dialog', () => {
    component.openSkill(component.SKILLS_LIST[0]);
    fixture.detectChanges();

    el.querySelector<HTMLElement>('.modal-style')!.click();
    fixture.detectChanges();
    expect(component.isModalOpen).withContext('dialog click').toBeTrue();

    el.querySelector<HTMLElement>('.modal-overlay')!.click();
    fixture.detectChanges();
    expect(component.isModalOpen).withContext('backdrop click').toBeFalse();
  });

  it('should label the dialog and move focus into it', () => {
    cards()[2].focus();
    cards()[2].click();
    fixture.detectChanges();
    const dialog = el.querySelector('[role="dialog"]')!;
    expect(dialog.getAttribute('aria-labelledby')).toBe('skill-dialog-title');
    expect(el.querySelector('#skill-dialog-title')).not.toBeNull();
    expect(document.activeElement).toBe(el.querySelector('.close-x'));
  });

  it('should return focus to the card that opened the dialog', () => {
    const card = cards()[3];
    card.focus();
    card.click();
    fixture.detectChanges();
    el.querySelector<HTMLButtonElement>('.close-x')!.click();
    fixture.detectChanges();
    expect(document.activeElement).toBe(card);
  });

  it('should keep Tab focus inside the dialog', () => {
    component.openSkill(component.SKILLS_LIST[0]);
    fixture.detectChanges();
    const tab = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true, bubbles: true });
    el.querySelector('.close-x')!.dispatchEvent(tab);
    expect(tab.defaultPrevented).toBeTrue();
  });

  it('should ignore Escape when the dialog is closed', () => {
    const before = document.activeElement;
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(component.isModalOpen).toBeFalse();
    expect(document.activeElement).toBe(before);
  });

  it('should close the modal on Escape', () => {
    component.openSkill(component.SKILLS_LIST[0]);
    fixture.detectChanges();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    expect(component.isModalOpen).toBeFalse();
  });
});

import { contact, event, formatDate, isSelling, tiers } from './site';

export type Faq = { q: string; a: string };

const vip = tiers.find((t) => t.id === 'vip');
const general = tiers.find((t) => t.id === 'general');

const whenAnswer = isSelling
  ? `The next bootcamp runs on ${formatDate(event.nextDate)}, ${event.hours}. It's ${
      event.edition === 'Live' ? 'a live event' : 'an Encore broadcast'
    }, held online.`
  : `A date hasn't been announced yet. The most recent edition was the ${event.lastEdition.label.toLowerCase()} on ${formatDate(
      event.lastEdition.date,
    )}. Join the waitlist and you'll hear first when the next date, and any replay, is released.`;

const costAnswer = isSelling
  ? `General Admission is ${general?.price || 'listed at checkout'} and VIP Access is ${
      vip?.price || 'listed at checkout'
    }. You choose your ticket at checkout.`
  : `Prices are confirmed when the next date is announced. For reference, the last edition was ${general?.lastPrice} for General Admission and ${vip?.lastPrice} for VIP Access.`;

/** Answers are drawn from the published FAQ and checkout. Nothing here is new policy. */
export const faqs: Faq[] = [
  {
    q: 'Who is the bootcamp for?',
    a: 'Working professionals, people with a job or a side hustle, people between jobs, beginners in business, and anyone who wants to start or grow their own business. It is especially relevant if you want to invest in real estate and need the funding to do it.',
  },
  {
    q: 'Who is it not for?',
    a: 'If you are only casually interested in business, this probably isn’t your day. It is not another item for a collection of courses, books and videos that stay untouched. It is for people who are serious about setting up their business, building business credit and securing funding.',
  },
  { q: 'When is the next bootcamp?', a: whenAnswer },
  { q: 'How much does it cost?', a: costAnswer },
  {
    q: 'Is it live?',
    a: 'It depends on the edition, and the event page always says which one it is. Live bootcamps are taught in real time by Noelle and her team. Encore editions rebroadcast the best moments of the live events, with coaches and team members answering questions live in the chat.',
  },
  {
    q: 'What if I can’t attend on the day?',
    a: `Ticket holders get access to the replay after the event (${event.replayWindow} after the most recent edition). Because of that, event tickets are non-refundable, though they may be eligible for store credit or transfer to a future event.`,
  },
  {
    q: 'What does VIP add?',
    a: `VIP adds a live, VIP-only Q&A with Noelle’s Master Coaches (at least two hours, and it can run up to four depending on questions), access to the Grow Your Wealth VIP private community, two of Noelle’s eBooks, Making It! and Pick a Horse, and the QuickStart REI course.`,
  },
  {
    q: 'Who teaches it?',
    a: 'Noelle Randall, a real estate investor and entrepreneur of more than 20 years, together with her team of Master Coaches from Noelle Randall Coaching.',
  },
  {
    q: 'How do I get help?',
    a: `Email ${contact.email} or call ${contact.phoneDisplay}. The support team handles questions before and after you register.`,
  },
];

import { ChatInitializer } from './chat-initializer';

describe('ChatInitializer', () => {
  it('should create initializer successfully', () => {
    const initializer = new ChatInitializer('Hello this is a template');
    expect(initializer).toBeDefined();
  });

  it('should inject a simple variables successfully', () => {
    const initializer = new ChatInitializer(
      'Hello text(name) this is a basic template',
    );
    const injected = initializer.renderPrompt([
      { type: 'text', key: 'name', value: 'John' },
    ]);
    expect(injected).toEqual('Hello John this is a basic template');
  });

  it('should inject several mixed variables successfully', () => {
    const initializer = new ChatInitializer(
      'Hello text(name) this is a basic template with a longText(address) and another text(conclusion)',
    );

    const injected = initializer.renderPrompt([
      { type: 'text', key: 'name', value: 'John' },
      {
        type: 'longText',
        key: 'address',
        value: '49 Rue Saint Chamonix 69001 Lyon',
      },
      { type: 'text', key: 'conclusion', value: 'regards' },
    ]);
    expect(injected).toEqual(
      'Hello John this is a basic template with a 49 Rue Saint Chamonix 69001 Lyon and another regards',
    );
  });

  it('should inject a strange variables name successfully', () => {
    const initializer = new ChatInitializer(
      'Hello text(| . % ¥ a very strange name ^¨$*) this is a basic template',
    );
    const injected = initializer.renderPrompt([
      {
        type: 'text',
        key: '| . % ¥ a very strange name ^¨$*',
        value: 'A very strange value ¥#¥#$â a$a; s$ap;s .a,s;, ',
      },
    ]);
    expect(injected).toEqual(
      'Hello A very strange value ¥#¥#$â a$a; s$ap;s .a,s;,  this is a basic template',
    );
  });
});


  export class Customer {
    public Name: string;
    public SurName: string;
    public Age: string;
    public Gender: string;

    constructor();
    constructor(partial: any)
    constructor(partial?: any){
        Object.assign(this, partial);
    }

  }

  export class Person{
      public Name: string;

      constructor();
      constructor(partial: Person)
      constructor(partial?: Person){
        Object.assign(this, partial);
      }
  }
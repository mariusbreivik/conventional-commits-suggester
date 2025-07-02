declare module "conventional-commits-parser" {
  export interface ConventionalCommit {
    type?: string;
    scope?: string;
    subject?: string;
    header?: string;
    body?: string;
    footer?: string;
    notes?: any[];
    references?: any[];
    merge?: string | null;
    revert?: any;
    raw?: string;
    [key: string]: any;
  }

  export function sync(message: string): ConventionalCommit;
}
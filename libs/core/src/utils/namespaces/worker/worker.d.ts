export namespace WorkerNamespace {
  export interface EmailOptions {
    to: { email: string; name?: string };
    from: { email: string; name?: string };
    subject: string;
    attachments?: any[];
    content?: string;
    bcc?: string[];
    cc?: string[];
  }
}

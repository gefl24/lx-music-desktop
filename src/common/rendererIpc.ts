// For web version, we'll provide mock implementations

export function rendererSend(name: string): void
export function rendererSend<T>(name: string, params: T): void
export function rendererSend<T>(name: string, params?: T): void {
  // Mock implementation for web
}

export function rendererSendSync(name: string): void
export function rendererSendSync<T>(name: string, params: T): void
export function rendererSendSync<T>(name: string, params?: T): void {
  // Mock implementation for web
}

export async function rendererInvoke(name: string): Promise<void>
export async function rendererInvoke<V>(name: string): Promise<V>
export async function rendererInvoke<T>(name: string, params: T): Promise<void>
export async function rendererInvoke<T, V>(name: string, params: T): Promise<V>
export async function rendererInvoke <T, V>(name: string, params?: T): Promise<V> {
  return Promise.resolve({} as V)
}

export function rendererOn(name: string, listener: any): void
export function rendererOn<T>(name: string, listener: any): void
export function rendererOn<T>(name: string, listener: any): void {
  // Mock implementation for web
}

export function rendererOnce(name: string, listener: any): void
export function rendererOnce<T>(name: string, listener: any): void
export function rendererOnce<T>(name: string, listener: any): void {
  // Mock implementation for web
}

export const rendererOff = (name: string, listener: (...args: any[]) => any) => {
  // Mock implementation for web
}

export const rendererOffAll = (name: string) => {
  // Mock implementation for web
}

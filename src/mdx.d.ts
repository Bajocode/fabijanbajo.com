declare module '*.mdx' {
  const MDXComponent: (props: any) => JSX.Element;
  export default MDXComponent;
}

declare module 'mdx.macro' {
  export function importMDX(
    path: string,
  ): Promise<{ default: React.LazyExoticComponent<any> }>;
}

export interface TextDoc {
    source: string;
    html: string;
}

/**
 * &lt;li class=&quot;h{level}&quot;&gt;&lt;a href=&quot;#{id}&quot;&gt;{name}&lt;/li&gt;
 */
export interface TocItem {
    name: string;
    level: number;
    id: string;
}

export interface RenderedDocument {
    doc: TextDoc;
    toc: TocItem[];
    languages: string[];
}

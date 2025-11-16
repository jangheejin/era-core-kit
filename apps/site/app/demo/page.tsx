import { cms } from '@/lib/cms';
import { renderBlock } from '@/utils/renderBlock';

export default async function DemoPage() {
  const data = cms.get("demo-case-study");

  const transformedBlocks = data.blocks.map((block: any) => ({
    ...block,
    props: block.props ?? { content: block.content },
  }));

  return (
    <main>
      <h1>{data.title}</h1>
      {transformedBlocks.map((block, i) => (
        <div key={i}>{renderBlock(block, i)}</div>
      ))}
    </main>
  );
}

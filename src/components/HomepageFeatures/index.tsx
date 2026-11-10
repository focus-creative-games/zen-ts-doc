import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import Translate from '@docusaurus/Translate';
import styles from './styles.module.css';

function Feature({
  title,
  icon,
  description,
}: {
  title: ReactNode;
  icon: string;
  description: ReactNode;
}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <div className="featureIcon">{icon}</div>
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          <Feature
            icon="⚡"
            title={
              <Translate id="homepage.feature.easy.title">CLR 类型按需绑定</Translate>
            }
            description={
              <Translate id="homepage.feature.easy.desc">CSharp / csharp: 懒绑定和共享签名桥，统一重载与 Marshal；无需业务逐类型 Wrap 白名单。</Translate>
            }
          />
          <Feature
            icon="🟦"
            title={
              <Translate id="homepage.feature.ts.title">TypeScript 与调试</Translate>
            }
            description={
              <Translate id="homepage.feature.ts.desc">TsProject 检查、emit、C# 声明与 Source Map；Editor 内置 V8 Inspector。</Translate>
            }
          />
          <Feature
            icon="📦"
            title={
              <Translate id="homepage.feature.il2cpp.title">原生 V8 与 HostJs</Translate>
            }
            description={
              <Translate id="homepage.feature.il2cpp.desc">原生平台静态链接官方 V8；WebGL/微信使用平台 VM。SDK 存 Library，兼容只读 Git 包。</Translate>
            }
          />
        </div>
      </div>
    </section>
  );
}

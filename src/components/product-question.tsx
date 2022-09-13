import { ComponentType } from 'react';
import { ProductQuestion, ProductQuestionType } from 'types/product';

type Props = {
  question: ProductQuestion;
};

function TextQuestion() {
  return null;
}

function SingleChoiceQuestion(props: Props) {
  const { question } = props;
  return (
    <label>
      {question.title}
      <select>
        {question.values.map(value => (
          <option key={value}>{value}</option>
        ))}
      </select>
    </label>
  );
}

const components: Record<ProductQuestionType, ComponentType<Props>> = {
  text: () => null,
  single: SingleChoiceQuestion,
  multiple: () => null,
  date: () => null,
  time: () => null,
};

export function ProductQuestion(props: Props): JSX.Element {
  const { question } = props;
  const QuestionComponent = components[question.typeCode];

  return <QuestionComponent question={question} />;
}

export default ProductQuestion;

import DiaryItem from "./DiaryItem";

const DiaryList = ({onEdit, onRemove, dairyList}) => {
  return (
    <div className="DiaryList">
      <h2>일기 리스트</h2>
      <h4>{dairyList.length}개의 일기가 있습니다.</h4>
      <div>
        {dairyList.map((obj) => (
          <DiaryItem key={obj.id} {...obj} onEdit={onEdit} onRemove={onRemove}/>
        ))}
      </div>
    </div>
  );
}

DiaryList.defaultProps = {
  dairyList: []
}

export default DiaryList;
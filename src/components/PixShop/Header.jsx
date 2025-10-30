/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { SparkleIcon } from './icons';
import '../../styles/PixShop.css';

const Header = () => {
  return (
    <header className="pixshopHeader">
      <div className="pixshopHeaderContent">
        <SparkleIcon className="pixshopHeaderIcon" />
        <h1 className="pixshopHeaderTitle">PixShop</h1>
      </div>
    </header>
  );
};

export default Header;

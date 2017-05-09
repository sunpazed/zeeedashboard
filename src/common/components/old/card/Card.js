import React from 'react';

import { QR } from '~/common/components';



import styles from './Card.css';
import IconFactory from '~/images/IconFactory' ;

class Card extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      showQr: false,
    };

    this.toggleQr = this.toggleQr.bind(this);

  }

  toggleQr() {
    this.setState({
      showQr: !this.state.showQr,
    });
  }


  render() {
    const { profile, showQr, add } = this.props;
    console.log(profile.photo_url);
    return (
      <div className={styles.wrapper}>
        <div className={!this.state.showQr ? styles.flipContainer : styles.flipedContainer}>
          <div className={styles.flipper}>
            <div className={styles.frontGreen}>
              {profile &&
                <div className={styles.cardWrapper}>
                  <div className={styles.name}>{profile.name && profile.name}</div>
                  <div className={styles.photoWrapper}>
                    <div className={styles.lob}>{profile.lob && profile.lob}</div>
                    <img className={styles.photo} src={profile.photo_url && profile.photo_url} />
                  </div>
                  <div className={styles.title}>{profile.title && profile.title}</div>

                  {profile.flavour_text &&
                    <p className={styles.flavour}>{profile.flavour_text}</p>
                  }

                  {/* <div>location: {profile.location && profile.location}</div>
                  <div>skills: {profile.skills && profile.skills}</div>
                  <div>tenure: {profile.tenure && profile.tenure}</div> */}
                  {showQr && <button className={styles.toggleButton} onClick={() => this.toggleQr()} type="button">QR</button>}
                  {add && <button className={styles.toggleButton} onClick={() => add()} type="button">Add +</button>}
                </div>
              }
            </div>
            {showQr &&
              <div className={styles.back}>
                <div className={styles.logoWrapper}>
                  <div className={styles.reaLogo} />
                </div>
                {profile && profile.id && <QR value={`${profile.id}|user`} />}
                <button className={styles.toggleButton} onClick={() => this.toggleQr()} type="button">Card</button>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Card;

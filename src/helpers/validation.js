/**
 * Email address validation based on RFC 2822
 * @param emailAddress
 * @returns {boolean}
 */
export function checkEmail(emailAddress) {
    const emailCheck=/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

    return emailCheck.test(emailAddress);
}
